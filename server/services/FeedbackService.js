const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

class FeedbackService {
  constructor(datafile) {
    this.datafile = datafile;
  }

  async getList() {
    const data = await this.getData();
    console.log(`feedback Service ${JSON.stringify(data)}`)
    return data;
  }

  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    if(!data) return [];
    return JSON.parse(data);
  }
}

module.exports = FeedbackService;