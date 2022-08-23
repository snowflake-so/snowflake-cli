import { SafeType } from '@snowflake-so/safe-sdk';
import moment from 'moment';

export const serializeSafeData = (safes: SafeType[]) =>
  safes.map<any>(safe => ({
    address: safe.safeAddress.toString(),
    approvalsRequired: safe.approvalsRequired,
    owners: safe.owners.length,
    createAt: moment.unix(parseInt(safe.createdAt.toString())).format('DD MMMM YYYY HH:mm:ss'),
    ownerSetSeqno: safe.ownerSetSeqno,
  }));
