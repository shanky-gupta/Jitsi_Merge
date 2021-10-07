// @flow

import { NativeModules } from 'react-native';
import { AsyncStorage } from 'react-native';

import { loadScript } from '../util';
import logger from './logger';

export * from './functions.any';

const { JavaScriptSandbox } = NativeModules;

/**
 * Loads config.js from a specific remote server.
 *
 * @param {string} url - The URL to load.
 * @returns {Promise<Object>}
 */
export async function loadConfig(url: string): Promise<Object> {
    try {
        const cdnurl = 'https://melpstatic.sgp1.digitaloceanspaces.com/conf/config.js';
        var configTxt = localStorage.getItem('CONFIG_DATA');
          if(! configTxt){
              configTxt = await loadScript(cdnurl, 25 * 1000 /* Timeout in ms */, true /* skipeval */);
              localStorage.setItem('CONFIG_DATA' , configTxt );
             
         }
             const configJson = await JavaScriptSandbox.evaluate(`${configTxt}\nJSON.stringify(config);`);
              const config = JSON.parse(configJson);

        if (typeof config !== 'object') {
            throw new Error('config is not an object');
        }        
        
        logger.info(`Config loaded from ${cdnurl}`);

        return config;
    } catch (err) {
        logger.error(`Failed to load config from ${cdnurl}`, err);

        throw err;
    }
}
