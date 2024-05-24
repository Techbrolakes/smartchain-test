"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureConnection = void 0;
require('@abtnode/mongoose-nedb').install();
const os = require('os');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;
const dbPath = path.join(os.tmpdir(), 'nedb');
fs.mkdirSync(dbPath, { recursive: true });
const ensureConnection = () => {
    return new Promise((resolve, reject) => {
        // This is needed
        mongoose.connect('mongodb://localhost/test', { dbPath });
        const db = mongoose.connection;
        db.on('error', (err) => {
            console.error.bind(console, 'connection error:');
            reject(err);
        });
        db.once('open', () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('connected', dbPath);
            resolve(db);
        }));
    });
};
exports.ensureConnection = ensureConnection;
