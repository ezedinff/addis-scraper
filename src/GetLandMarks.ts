import axios from 'axios';
import * as fs from 'fs';
export class GetLandMarks {
    features = [
        'Pharmacy','Hospital','Cafe(Coffee, Tea)', 'Restaurant', 'Embassy', 'Hotel', 'Schools', 'College', 'Park', 'Museums', 'Theatre'
    ];
    subCities = [
        'Arada',
        'akaki kality', 'Addis Ketema', 'Bole', 'Gulele', 'Kirkos', 'Kolfe Keraneo', 'Lideta', 'Nefas silk', 'yeka'
    ];
    async getData(url) {
        const data =  await axios.get(url);
        return  data.data;
    }
    async parseData() {
        const landMarks = [];
        for (const feature of this.features) {
            const items = await this.getData(`https://adrasha.io/ws/location?searchText=${feature}&searchType=2`);
            for (const item of items['features']) {
                if (!landMarks.includes(item.properties.landmark_name)) {
                    landMarks.push(item.properties.landmark_name);
                }
            }
            this.saveToFile(`./data/populars/${feature}.json`, JSON.stringify(items));
        }
        for (const city of this.subCities) {
            const items =  await this.getData(`https://adrasha.io/ws/location?searchText=${city}&searchType=2`);
            for (const item of items['features']) {
                if (!landMarks.includes(item.properties.landmark_name)) {
                    landMarks.push(item.properties.landmark_name);
                }
            }
            this.saveToFile(`./data/bySubCity/${city}.json`, JSON.stringify(items));
        }
        this.saveToFile('./config/landmarks.json', JSON.stringify({landMarks: landMarks}));
        for (const landMark of landMarks) {
            const data = await this.getData(`https://adrasha.io/ws/location?searchText=${landMark}&searchType=2`);
            this.saveToFile(`./data/byLandMark/${landMark}.json`, JSON.stringify(data));
        }
    }
    saveToFile(path, data) {
        fs.writeFile(path, data, () => {});
    }
}
