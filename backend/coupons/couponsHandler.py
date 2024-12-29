import csv
import os

def loadCoupons(emptyDict):
  try:
    with open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'coupons.csv'), 'r') as file:
      csv_reader = csv.DictReader(file)
      for row in csv_reader:
         emptyDict[row['COUPON']] = float(row['MULTIPLIER'])
  except Exception as e:
    print('There was a problem loading the coupon file: ' + str(e))
    