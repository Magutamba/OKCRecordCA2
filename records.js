//import mongoose package
const mongoose = require("mongoose");
//Raw doc:{year,wins,losses,playoffFinish,}
const recordsSchema = new mongoose.Schema({
    //validation messages,if validation fails
    year: { type: String, required: true,match:[/^\d{4}-\d{4}$/,'Year must be in format YYYY-YYYY']},//regex from w3 schools
    wins: { type: Number, required: true,min:[0,'Wins cannot be less than zero'],max:[82, 'Wins cannot be more than 82']},
    losses: { type: Number, required: true,min:[0,'Losses cannot be less than zero'],max:[82, 'Losses cannot be more than 82']},
    seed: { type: Number, required: true,min:[1,'Seed cannot be less than 1'],max:[15,'Seed cannot be more than 15']},
    playoffFinish: { type: String, required: true, enum:['Did not qualify','First Round','Conference semifinals','NBA champions']},
    expectedW_L: { type: String, required: true,match:[/^\d{1,2}-\d{1,2}$/,'The expected W-L format is 77-6 or 6-77 ']}//reggex from w3 schools

}, { versionKey: false });//disable version field
//creat model record and export it
module.exports = mongoose.model('records', recordsSchema);

