import os
import cv2
import pytesseract
from pdf2image import convert_from_path
import numpy as np

def has_significant_overlap(rect1, rect2, threshold=0.2):
    x1, y1, w1, h1 = rect1
    x2, y2, w2, h2 = rect2
    
    # Expand rectangles slightly to catch nearby fragments
    expand = 20
    x1, y1 = x1 - expand, y1 - expand
    w1, h1 = w1 + 2*expand, h1 + 2*expand
    x2, y2 = x2 - expand, y2 - expand
    w2, h2 = w2 + 2*expand, h2 + 2*expand
    
    x_left = max(x1, x2)
    y_top = max(y1, y2)
    x_right = min(x1 + w1, x2 + w2)
    y_bottom = min(y1 + h1, y2 + h2)
    
    if x_right < x_left or y_bottom < y_top:
        return False
    
    intersection = (x_right - x_left) * (y_bottom - y_top)
    area1 = w1 * h1
    area2 = w2 * h2
    smaller_area = min(area1, area2)
    
    return intersection / smaller_area > threshold

def get_bounding_rect(rects):
    """Get the bounding rectangle that contains all given rectangles"""
    if not rects:
        return None
    
    x1 = min(rect[0] for rect in rects)
    y1 = min(rect[1] for rect in rects)
    x2 = max(rect[0] + rect[2] for rect in rects)
    y2 = max(rect[1] + rect[3] for rect in rects)
    
    return (x1, y1, x2 - x1, y2 - y1)

def is_likely_text(roi):
    # Convert to grayscale if not already
    if len(roi.shape) == 3:
        roi_gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    else:
        roi_gray = roi
        
    # Get text confidence
    text = pytesseract.image_to_string(roi_gray, config='--psm 6')
    conf = pytesseract.image_to_data(roi_gray, config='--psm 6', output_type=pytesseract.Output.DICT)
    
    # If there's significant text with good confidence, it's likely text
    confidences = [int(x) for x in conf['conf'] if x != '-1']
    if confidences and len(text.strip()) > 50 and sum(confidences)/len(confidences) > 60:
        return True
    return False

def is_too_large_portion(roi, original_img):
    roi_area = roi.shape[0] * roi.shape[1]
    img_area = original_img.shape[0] * original_img.shape[1]
    return roi_area > (img_area * 0.15)  # If region is more than 15% of page

def should_merge_figures(rect1, rect2, max_distance=20):
    x1, y1, w1, h1 = rect1
    x2, y2, w2, h2 = rect2
    
    # Calculate centers
    center1_x = x1 + w1/2
    center1_y = y1 + h1/2
    center2_x = x2 + w2/2
    center2_y = y2 + h2/2
    
    # Calculate distance between centers
    distance = np.sqrt((center1_x - center2_x)**2 + (center1_y - center2_y)**2)
    
    # Check if rectangles are close and similar in size
    size_ratio = max(w1*h1, w2*h2) / min(w1*h1, w2*h2)
    
    return distance < max_distance and size_ratio < 3

def merge_rectangles(rect1, rect2):
    x1, y1, w1, h1, area1 = rect1
    x2, y2, w2, h2, area2 = rect2
    
    # Find the bounding box that contains both rectangles
    x = min(x1, x2)
    y = min(y1, y2)
    w = max(x1 + w1, x2 + w2) - x
    h = max(y1 + h1, y2 + h2) - y
    area = w * h
    
    return (x, y, w, h, area)

def get_figure_score(roi):
    """
    Calculate a score for how likely this is to be a complete figure.
    Higher score = better figure
    """
    if len(roi.shape) == 3:
        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    else:
        gray = roi
        
    # Get ratio of dark pixels
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)
    dark_pixels = np.sum(binary == 255)
    total_pixels = binary.size
    dark_ratio = dark_pixels / total_pixels
    
    # Get contours to check compactness
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return 0
    
    # Calculate contour density (more compact = better)
    hull = cv2.convexHull(contours[0])
    hull_area = cv2.contourArea(hull)
    if hull_area == 0:
        return 0
    density = dark_pixels / hull_area
    
    # Ideal dark ratio should be between 0.2 and 0.8
    ratio_score = 1.0 - abs(dark_ratio - 0.5)
    
    return ratio_score * density

def extract_figures_from_pdf(pdf_path, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    pages = convert_from_path(pdf_path)
    figure_count = 0

    for page_num, page in enumerate(pages):
        page_image_path = os.path.join(output_folder, f'page_{page_num}.png')
        page.save(page_image_path, 'PNG')
        img = cv2.imread(page_image_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        figures_found = []

        # First approach (good for last page)
        _, photo_mask = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)
        photo_contours, _ = cv2.findContours(photo_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if photo_contours:
            photo_contour = max(photo_contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(photo_contour)
            photo = img[y:y+h, x:x+w]
            photo_gray = cv2.cvtColor(photo, cv2.COLOR_BGR2GRAY)
            
            _, sheet_mask = cv2.threshold(photo_gray, 127, 255, cv2.THRESH_BINARY)
            sheet_contours, _ = cv2.findContours(sheet_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            if sheet_contours:
                sheet_contour = max(sheet_contours, key=cv2.contourArea)
                x_sheet, y_sheet, w_sheet, h_sheet = cv2.boundingRect(sheet_contour)
                sheet = photo[y_sheet:y_sheet+h_sheet, x_sheet:x_sheet+w_sheet]
                sheet_gray = cv2.cvtColor(sheet, cv2.COLOR_BGR2GRAY)
                
                # Try multiple thresholds for the last page
                for thresh_val in [90, 100, 110]:
                    _, figure_mask = cv2.threshold(sheet_gray, thresh_val, 255, cv2.THRESH_BINARY_INV)
                    figure_contours, _ = cv2.findContours(figure_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                    
                    for cnt in figure_contours:
                        x_fig, y_fig, w_fig, h_fig = cv2.boundingRect(cnt)
                        area = w_fig * h_fig
                        sheet_area = w_sheet * h_sheet
                        
                        if area < (sheet_area * 0.01) or area > (sheet_area * 0.3):  # More permissive
                            continue
                        
                        aspect_ratio = w_fig / h_fig
                        if aspect_ratio < 0.2 or aspect_ratio > 4.0:  # More permissive
                            continue

                        roi = sheet[y_fig:y_fig+h_fig, x_fig:x_fig+w_fig]
                        if is_likely_text(roi):
                            continue

                        x_global = x + x_sheet + x_fig
                        y_global = y + y_sheet + y_fig
                        figures_found.append((x_global, y_global, w_fig, h_fig, area))

        # Second approach (good for other pages)
        min_area = (img.shape[1] * img.shape[0]) * 0.003  # More permissive
        max_area = (img.shape[1] * img.shape[0]) * 0.15   # Stricter max area
        
        thresholds = [
            cv2.threshold(gray, 90, 255, cv2.THRESH_BINARY_INV)[1],
            cv2.threshold(gray, 110, 255, cv2.THRESH_BINARY_INV)[1],
            cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 7, 2)
        ]

        for thresh in thresholds:
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            for cnt in contours:
                x, y, w, h = cv2.boundingRect(cnt)
                area = w * h
                
                if area < min_area or area > max_area:
                    continue

                aspect_ratio = w / h
                if aspect_ratio < 0.2 or aspect_ratio > 4.0:
                    continue

                roi = img[y:y+h, x:x+w]
                if is_likely_text(roi) or is_too_large_portion(roi, img):
                    continue

                figures_found.append((x, y, w, h, area))

        # Merge nearby figures that might be fragments of the same figure
        figures_found.sort(key=lambda x: x[4])  # Sort by area
        merged_figures = []
        used_indices = set()
        
        for i, fig1 in enumerate(figures_found):
            if i in used_indices:
                continue
                
            current_figure = fig1
            merged = True
            while merged:
                merged = False
                for j, fig2 in enumerate(figures_found):
                    if j in used_indices or i == j:
                        continue
                    if should_merge_figures(current_figure[:4], fig2[:4]):
                        current_figure = merge_rectangles(current_figure, fig2)
                        used_indices.add(j)
                        merged = True
                        break
            
            used_indices.add(i)
            if not is_too_large_portion(img[current_figure[1]:current_figure[1]+current_figure[3], 
                                          current_figure[0]:current_figure[0]+current_figure[2]], img):
                merged_figures.append(current_figure)

        # Remove overlapping regions from merged figures
        merged_figures.sort(key=lambda x: x[4])  # Sort by area
        final_figures = []
        
        for figure in merged_figures:
            overlap = False
            for selected in final_figures:
                if has_significant_overlap(figure[:4], selected[:4]):
                    overlap = True
                    break
            if not overlap:
                final_figures.append(figure)

        # Group overlapping and nearby regions
        figures_found.sort(key=lambda x: x[4], reverse=True)  # Sort by area
        groups = []
        used = set()

        for i, fig1 in enumerate(figures_found):
            if i in used:
                continue
                
            current_group = [fig1[:4]]  # Store only the rectangle coordinates
            used.add(i)
            
            # Keep checking for more overlaps until no more are found
            changed = True
            while changed:
                changed = False
                for j, fig2 in enumerate(figures_found):
                    if j in used:
                        continue
                        
                    # Check if fig2 overlaps with ANY rectangle in the current group
                    for rect in current_group:
                        if has_significant_overlap(rect, fig2[:4]):
                            current_group.append(fig2[:4])
                            used.add(j)
                            changed = True
                            break
            
            if current_group:  # If we found a group, get its bounding rectangle
                groups.append(get_bounding_rect(current_group))

        # Sort groups by y-coordinate (top to bottom)
        groups.sort(key=lambda rect: rect[1])  # sort by y-coordinate

        # Save the grouped figures in top-to-bottom order
        for x, y, w, h in groups:
            if is_too_large_portion(img[y:y+h, x:x+w], img):
                continue
                
            padding = 10
            x_start = max(0, x - padding)
            y_start = max(0, y - padding)
            x_end = min(img.shape[1], x + w + padding)
            y_end = min(img.shape[0], y + h + padding)
            
            roi = img[y_start:y_end, x_start:x_end]
            
            figure_count += 1
            figure_path = os.path.join(output_folder, f'figure_{page_num}_{figure_count}.png')
            cv2.imwrite(figure_path, roi)

        os.remove(page_image_path)

if __name__ == '__main__':
    pdf_path = 'your_exam_pdf.pdf'
    output_folder = 'extracted_figures'
    extract_figures_from_pdf(pdf_path, output_folder)
