# JSON DATA PUSH API by Robert Prochowicz, great help from Henri-Francois Chadeisson and Scott Rigney
# Tested with MSTR 10.10 / 2018-01-29

import requests


### Parameters ###



def get_report(pageNumber):
    print("Getting report results...")

    data_details = ''  # Values used to determine the data included in the report instance – such as attribute values, metric values and view filters. JSON format. Leave empty to import everything
    number = 1000
    requestUrl = "http://api.ewg.org/search/?API_KEY=MOBILE_APP&page=" + str(pageNumber + 1) + "&per_page=" + str(number) + "&uuid=B67AE7A1-3054-4DEC-BD1F-2CDE8304E3F3"
    print(requestUrl)
    r = requests.get(
        "http://api.ewg.org/search/?API_KEY=MOBILE_APP&page=" + str(pageNumber + 1) + "&per_page=" + str(number) + "&uuid=B67AE7A1-3054-4DEC-BD1F-2CDE8304E3F3")
    if r.ok:
        print("Report results received...")
        print("HTTP %i - %s" % (r.status_code, r.reason))
        return r.text
    else:
        print("HTTP %i - %s" % (r.status_code, r.reason))


def export_to_json(pageNumber):
    print("Exporting report results to JSON file...")
    r = get_report(pageNumber)
    text_file = open("report_results_" + str(pageNumber + 1) + ".json", "w", encoding="utf8")
    text_file.write(r)
    text_file.close()


def main():
    for pNum in range(143):
        export_to_json(pNum)


### Main program
main()
