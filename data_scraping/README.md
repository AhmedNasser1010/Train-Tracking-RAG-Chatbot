# Egypt Railways Data Scraping

## Endpoints
- Trains: `https://egytrains.com/_next/data/5OCtobRGdzcWEf5ZH7ieN/train/1.json`
- schedule: `https://egytrains.com/_next/data/5OCtobRGdzcWEf5ZH7ieN/trains/Cairo.json`


## Usage
Fetch schedule data:
```bash
python3 schedule_scraping.py
# return's schedule_output.csv
```

Fetch trains data:
```bash
python3 trains_scraping.py
# return's trains_output.csv
```

**The endpoint token should be changed after a while**
```txt
https://egytrains.com/_next/data/5OCtobRGdzcWEf5ZH7ieN/trains/
                                 ^                   ^
```
