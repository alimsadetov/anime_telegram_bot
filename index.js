const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const TOKEN = '1799360438:AAHq9TI7eokOCSXhhbCQPOrn04nNR9dJfUc';

const bot = new TelegramBot(TOKEN, {
  polling: true
})



//бот отвечает на текстовое сообщение
bot.on('text', (msg) =>{
  console.log(msg.text);
  if ((msg.text == 'привет') || (msg.text == 'Привет')){
    bot.sendMessage(msg.chat.id, `Привет, ${msg.chat.first_name}`)
  }
  else{
    bot.sendMessage(msg.chat.id, 'Для того, чтобы бот узнал аниме на картинке, просто скинь её в чат. Скрины тоже подойдут. Если бот долго не отвечает, попробуй скинуть эту же картинку ещё раз. Бот определяет процент совпадения, если он меньше 90%, то результат скорее всего неверный. Удачи!')
  };
  
});
//бот отвечает на фото
bot.on('photo', (msg) =>{
  let url = `https://api.telegram.org/bot${TOKEN}/getFile?file_id=${msg.photo[0].file_id}`;
  //запрос на api telegram для получения ссылки отправленного фото
  axios.get(url).then( (result) =>{
    let file_path =  result.data.result.file_path;
    let download_url = `https://api.telegram.org/file/bot${TOKEN}/${file_path}`;
    let api_url = `https://api.trace.moe/search?cutBorders&anilistInfo&url=${download_url}`;

    //запрос на апи аниме
    axios.get(api_url).then((anime_info) =>{
      //чтение данных с ответа апи
      let anime_name_jp = anime_info.data.result[0].anilist.title.romaji;
      let anime_name_en = anime_info.data.result[0].anilist.title.english;
      let isAdult = anime_info.data.result[0].anilist.isAdult ? 'да' : 'нет';
      let anime_ep = anime_info.data.result[0].episode;
      let anime_video = anime_info.data.result[0].video;
      let anime_image = anime_info.data.result[0].image;
      let anime_sim = anime_info.data.result[0].similarity * 100;

      //вывод всей инфы
      bot.sendMessage(msg.chat.id, `Название аниме (ромадзи) - ${anime_name_jp}`);
      bot.sendMessage(msg.chat.id, `Название аниме (англ) - ${anime_name_en}`);
      bot.sendMessage(msg.chat.id, `Аниме для взрослых - ${isAdult}`);
      bot.sendMessage(msg.chat.id, `Серия - ${anime_ep}`);
      bot.sendMessage(msg.chat.id, `Совпадение - ${anime_sim}%`);
      bot.sendPhoto(msg.chat.id, `${anime_image}`);
      bot.sendVideo(msg.chat.id, `${anime_video}`);
    })
  });
})