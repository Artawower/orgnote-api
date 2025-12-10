import { ModelsUserPersonalInfo } from 'src/remote-api';
import { PublicUser } from './note';

export interface User extends PublicUser {}

export interface PersonalInfo extends ModelsUserPersonalInfo {}
