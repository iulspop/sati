import { promptQueue } from '../domain/index.js'

const query = async () => {
 const data = promptQueue.query();
 return data;
}
 
export { query }