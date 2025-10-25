import { Blueprints } from 'battlefield6-api';

const blueprints = await Blueprints.list();

console.log('Blueprints:', blueprints);
