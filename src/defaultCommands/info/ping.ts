import { Command } from '../../modules';
import { Permission } from '../../interfaces';

export default new Command({
  name: 'ping',
  description: 'Am I working?',
  permission: Permission.USER,
  category: 'info',
  runIn: ['guild', 'dm'],
  async run() {
    this.send!('Pong!');
  },
});
