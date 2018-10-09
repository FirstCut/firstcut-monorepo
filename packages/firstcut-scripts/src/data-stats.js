// import Models from 'firstcut-models';
import fs from 'fs';

export default function countVideographerCities() {
  // a very innefficient count
  const players = Models.Collaborator.find({});
  const counts = players.reduce((result, player) => {
    const cities = result;
    if (player.isQualifiedVideographer()) {
      const city = player.cityDisplayName;
      if (!cities[city]) {
        cities[city] = 0;
      }
      const numInCity = cities[city];
      cities[city] = numInCity + 1;
    }
    return cities;
  }, {});
  const filename = 'videographercities.json';
  const json = JSON.stringify(counts);
  fs.writeFileSync(`/Users/artichokes/FirstCut/firstcutfirstcut-pipeline-consts/${filename}`, json);
}
