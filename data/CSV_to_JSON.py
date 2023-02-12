import csv, json

tsvFilePath = 'OpenScoutMap - Datensatz.tsv'
jsFilePath = 'OpenScoutMapData.js'

data = []
flagHeadlines = 0
with open(tsvFilePath, newline='\n', encoding='utf-8-sig') as tsvFile:
    for line in tsvFile.readlines():
        if flagHeadlines > 1:
            elems = line.split('\t')
            elems[11] = ''.join(filter(str.isalnum, elems[11]))
            
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
            data.append(datapoint)
        else:
            flagHeadlines += 1

with open(jsFilePath, 'w+') as jsFile:
    jsonString = 'var list_places ='
    jsonString += json.dumps(data)
    spcial_char_map = {ord('ä'): '&auml;', ord('ü'): '&Uuml;', ord('ö'): '&ouml;', ord('Ä'): '&Auml;', ord('Ü'): '&Uuml;', ord('Ö'): '&Ouml;', ord('ß'): '&szlig'}
    jsonString = jsonString.translate(spcial_char_map)
    jsonString += ';'
    jsFile.write(jsonString)
