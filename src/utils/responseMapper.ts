import * as moment from 'moment';
import { Messages } from 'src/models/messages.model';

export function mapPostResponse(responses: Array<Messages>) {
  return responses.map((response) => ({ messageId: response.id }));
}

export function mapGetResponse(responses: Array<Messages>) {
  return responses.map((response) => ({
    delivery_time: moment(response.deliveryTime).format('YYMMDDHHmm'),
    status: response.status,
  }));
}
