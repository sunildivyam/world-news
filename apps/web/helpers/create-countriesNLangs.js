const fs = require('fs');
const path = require('path');
const langMap = new Map();

function toDashCase(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function createLanguage(languages) {
  return Object.entries(languages).map(([code3, name]) => ({
    code: code3.substring(0, 2),
    code3: code3,
    name: name
  }));
}

function getCountryCode(tld) {
  if (!tld?.length) {
    console.log("emptyCode")
    return "";
  }

  return tld[0].toLowerCase().split('.')[1]
}

function createCountriesNLangs() {
  try {
    const inputPath = path.join(__dirname, '../data/countries.json');
    const outputPath = path.join(__dirname, '../data/seed_countries.json');
    const langPath = path.join(__dirname, '../data/seed_languages.json');

    const data = fs.readFileSync(inputPath, 'utf-8');
    const countries = JSON.parse(data);

    const formatted = countries.map(country => {
      const langs = createLanguage(country.languages);
      langs.map(l => {
        langMap.set(l.code3, { code: l.code, name: l.name })
      });

      return ({
        code: getCountryCode(country.tld),
        name: country.name.common,
        capital: { code: toDashCase(country.capital), name: country.capital },
        languages: langs.map(l => l.code)
      })
    });


    // fs.writeFileSync(outputPath, JSON.stringify(formatted, null, 2));
    console.log(`Successfully created ${outputPath}`);

    const lArr = Array.from(langMap).map(([code3, value]) => ({
      code: code3,
      code2: value.code,
      name: value.name
    }));

    fs.writeFileSync(langPath, JSON.stringify(lArr), null, 2);
    // console.log(lArr);
  } catch (error) {
    console.error('Error processing countries:', error);
    process.exit(1);
  }
}

createCountriesNLangs();
