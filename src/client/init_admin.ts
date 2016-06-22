import Layout from './ui/layout';
import { getSyncedStore } from './';
const syncedStore = getSyncedStore();

syncedStore.watchData(data => `<layout [data]="${JSON.stringify(data)}"></layout>`);
renderUI(syncedStore.getData());
