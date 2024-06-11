import { VandorPayLoad } from './Vandor.dto'
import { CustomerPayLoad } from '../dto/Customer.dto'

export type AuthPayload = VandorPayLoad | CustomerPayLoad 