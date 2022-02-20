import * as os from 'os';
import * as child from 'child_process';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
const messages = Messages.loadMessages('sfdx-navigator-from-setup', 'qf');

export default class QuickFind extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = messages.getMessage('examples').split(os.EOL);

  protected static flagsConfig = {
    path: flags.string({
      char: 'p',
      description: messages.getMessage('quickFindPathDescription'),
    }),
  };

  protected static requiresUsername = true;

  public run(): Promise<AnyJson> {
    const inputPath: string = (this.flags.path || 'home') as string;
    const targetusername: string = (this.flags.targetusername || 'deorg') as string;

    const pathMap = new Map<string, string>([
      ['home', 'lightning/setup/SetupOneHome/home'],
      ['deploy', 'lightning/setup/DeployStatus/home'],
      ['object-manager', 'lightning/setup/ObjectManager/home'],
      ['account', 'lightning/setup/ObjectManager/Account/Details/view'],
      ['account-fields', 'lightning/setup/ObjectManager/Account/FieldsAndRelationships/view'],
      ['opportunity', 'lightning/setup/ObjectManager/Opportunity/Details/view'],
      ['opportunity-fields', 'lightning/setup/ObjectManager/Opportunity/FieldsAndRelationships/view'],
    ]);

    if (!pathMap.has(inputPath)) {
      throw new SfdxError(messages.getMessage('errorNoKeyResults'));
    }

    const currentPath = pathMap.get(inputPath);
    child.exec(`sfdx force:org:open -u ${targetusername} -p ${currentPath}`, (err, stdout, stderr) => {
      this.ux.log(stdout);
      this.ux.log('Warning! ', stderr);
      if (err) this.ux.log('Error : ', err.toString());
    });

    return;
  }
}
