import csv, json

csvFilePath = 'OpenScoutMap.csv'
jsonFilePath = 'OpenScoutMap.json'

data = []
flagHeadlines = 0
with open(csvFilePath, newline='\n', encoding='utf-8-sig') as csvFile:
    for line in csvFile.readlines():
        elems = line.split(";")
        datapoint_coords = {
            "lat" : elems[1],
            "lng": elems[2],
        }
        datapoint = {
            "name" : elems[0],
            "coords" : datapoint_coords,
            "addr": elems[3],
            "postalcode": elems[4],
            "state": elems[5],
            "country": elems[6],
            "desc": elems[7],
            "website": elems[8],
            "imgsrc": elems[9],
            "tag": elems[10],
            "cathegory": elems[11]
        }
        print(datapoint)
        data.append(datapoint)
print(data)

with open(jsonFilePath, 'w+') as jsonFile:
    jsonString = json.dumps(data)
    spcial_char_map = {ord('ä'): '&auml;', ord('ü'): '&Uuml;', ord('ö'): '&ouml;', ord('Ä'): '&Auml;', ord('Ü'): '&Uuml;', ord('Ö'): '&Ouml;', ord('ß'): '&szlig'}
    jsonString = jsonString.translate(spcial_char_map)
    print(jsonString)
    jsonFile.write(jsonString)
