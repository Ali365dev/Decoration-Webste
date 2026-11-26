import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

// passthrough: unregistered routes (e.g. /api/admin/*) go to the real server
const mock = new MockAdapter(axios, { onNoMatch: 'passthrough' })

export default mock
