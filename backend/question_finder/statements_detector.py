import os
import cv2
import pytesseract
from pdf2image import convert_from_path

def load_image(image_path):
    """
    Load an image from the specified file path.
    
    Parameters:
    image_path (str): The file path of the image to be loaded.
    
    Returns:
    image: The loaded image.
    """
    return cv2.imread(image_path)
  
def is_overlapping(box1, box2, threshold):
    """Check if two boxes overlap or are within a specified threshold distance."""
    x1, y1, w1, h1 = box1
    x2, y2, w2, h2 = box2
    
    # Calculate distances between boxes
    distance_x = max(0, max(x1, x1 + w1) - min(x2, x2 + w2))
    distance_y = max(0, max(y1, y1 + h1) - min(y2, y2 + h2))
    
    # Check for overlap or within threshold distance
    return distance_x < threshold and distance_y < threshold
  
def combine_boxes(boxes, image_width, image_height, threshold_percent):
    """
    Combine overlapping bounding boxes into a list of bounding quadrilaterals.

    Parameters:
    boxes: List of bounding boxes defined as (x_start, y_start, width, height).
    image_width: The width of the image.
    image_height: The height of the image.
    threshold_percent: The percentage of the image dimensions to consider for combining boxes.

    Returns:
    A list of tuples representing the combined bounding boxes.
    """
    # Calculate the threshold in pixels
    threshold_x = (threshold_percent / 100) * image_width
    threshold_y = (threshold_percent / 100) * image_height
    
    combined_boxes = []
    visited = [False] * len(boxes)

    for i in range(len(boxes)):
        if not visited[i]:
            combined_box = list(boxes[i])  # Initialize with the first box
            visited[i] = True
            
            for j in range(i + 1, len(boxes)):
                if not visited[j] and is_overlapping(combined_box, boxes[j], min(threshold_x, threshold_y)):
                    # Update the combined box to encompass both
                    combined_box[0] = min(combined_box[0], boxes[j][0])  # x_start
                    combined_box[1] = min(combined_box[1], boxes[j][1])  # y_start
                    combined_box[2] = max(combined_box[0] + combined_box[2], boxes[j][0] + boxes[j][2]) - combined_box[0]  # width
                    combined_box[3] = max(combined_box[1] + combined_box[3], boxes[j][1] + boxes[j][3]) - combined_box[1]  # height
                    visited[j] = True

            combined_boxes.append(tuple(combined_box))  # Add the combined box to the list

    return combined_boxes

def preprocess_image(image):
    """
    Convert the image to grayscale and apply Gaussian blur.
    
    Parameters:
    image: The input image.
    
    Returns:
    blurred: The blurred grayscale image.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    return blurred

def detect_text_borders(image):
    """
    Use Pytesseract to detect text and get bounding boxes.
    
    Parameters:
    image: The input image.
    
    Returns:
    boxes: List of bounding boxes for detected text.
    """
    # Use Pytesseract to get bounding boxes
    data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
    boxes = []
    for i in range(len(data['text'])):
        if int(data['conf'][i]) > 60:  # Confidence threshold
            (x, y, w, h) = (data['left'][i], data['top'][i], data['width'][i], data['height'][i])
            boxes.append((x, y, w, h))
    return boxes

def merge_close_boxes(boxes, image_width, image_height, merge_percentage=0.05):
    """
    Merge close bounding boxes into larger bounding rectangles based on a percentage of image dimensions.

    Parameters:
    boxes: List of bounding boxes (x, y, width, height).
    image_width: Width of the image.
    image_height: Height of the image.
    merge_percentage: Percentage of image dimensions to use for merging.

    Returns:
    merged_rects: List of merged bounding rectangles.
    """
    merged_rects = []
    used = [False] * len(boxes)

    # Calculate the threshold in pixels
    distance_threshold_x = merge_percentage * image_width
    distance_threshold_y = merge_percentage * image_height

    for i in range(len(boxes)):
        if used[i]:
            continue
        
        x_start, y_start, width, height = boxes[i]
        x_end = x_start + width
        y_end = y_start + height
        
        for j in range(i + 1, len(boxes)):
            if used[j]:
                continue
            
            other_x_start, other_y_start, other_width, other_height = boxes[j]
            other_x_end = other_x_start + other_width
            other_y_end = other_y_start + other_height
            
            # Check if boxes are close enough to merge
            if (abs(x_start - other_x_end) < distance_threshold_x or abs(other_x_start - x_end) < distance_threshold_x) and \
               (abs(y_start - other_y_end) < distance_threshold_y or abs(other_y_start - y_end) < distance_threshold_y):
                # Extend the bounding box
                x_start = min(x_start, other_x_start)
                y_start = min(y_start, other_y_start)
                x_end = max(x_end, other_x_end)
                y_end = max(y_end, other_y_end)
                width = x_end - x_start
                height = y_end - y_start
                used[j] = True
        
        merged_rects.append((x_start, y_start, width, height))

    return merged_rects

def draw_text_borders(image, boxes):
    """
    Draw rectangles around detected text areas in the image.
    
    Parameters:
    image: The original image.
    boxes: List of bounding boxes for detected text.
    
    Returns:
    image_with_borders: The image with rectangles drawn around text areas.
    """
    image_with_borders = image.copy()
    for (x, y, w, h) in boxes:
        cv2.rectangle(image_with_borders, (x, y), (x + w, y + h), (0, 255, 0), 2)
    return image_with_borders

if __name__ == '__main__':
    pdf_path = 'your_exam_pdf.pdf'
    output_folder = 'extracted_texts'
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    pages = convert_from_path(pdf_path)
    text_count = 0

    for page_num, page in enumerate(pages):
        page_image_path = os.path.join(output_folder, f'page_{page_num}.png')
        page.save(page_image_path, 'PNG')
        image = cv2.imread(page_image_path)
        # Preprocess the image
        blurred = preprocess_image(image)
        
        # Detect text borders using Pytesseract
        boxes = detect_text_borders(blurred)
        image_height, image_width = image.shape[:2]
        merged_boxes = merge_close_boxes(boxes, image_width, image_height, merge_percentage=0.05)
        combined_boxes = combine_boxes(merged_boxes, image_width, image_height, threshold_percent=0.1)
        # Draw borders around detected text areas
        image_with_borders = draw_text_borders(image, combined_boxes)
        
        # Display the results
        cv2.imshow("Original Image", image)
        cv2.imshow("Text Borders", image_with_borders)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
