import { Blueprints } from 'battlefield6-api';

const blueprints = await Blueprints.get([{
    id:         '1234567890',
    version:    'abcdefghijklmnopqrstuvwxyz'
}]);

console.log('Blueprints:', blueprints);
