import { Charset } from '@/types/charset'
import { v4 as uuidv4 } from 'uuid'

export const ASCII_CHARSET: Charset = {
  id: '52b87aa5-0460-4e60-ad60-5715ef5e1942',
  text: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  is_enabled: true,
  is_default: true,
  is_ascii: true,
  amount: 5,
}

export const DEFAULT_CHARSETS: Charset[] = [
  ASCII_CHARSET,
  {
    id: '183166e2-4b3d-4b4c-a0ef-2e25783a416a',
    text: 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ⓪①②③④⑤⑥⑦⑧⑨',
    is_enabled: true,
    is_default: true,
    amount: 1,
  },
  {
    id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    text: 'ÁßČĎĔŦĞĤĨĴĶĹMŃŐPQŔŚŤÚVŴЖŶŹÁßČĎĔŦĞĤĨĴĶĹMŃŐPQŔŚŤÚVŴЖŶŹ0123456789',
    is_enabled: true,
    is_default: true,
    amount: 1,
  },
  {
    id: 'e5bd9f56-11d2-47c0-b2b9-1f2c9b4b9574',
    text: 'äbċdëfġhïjklmnöpqrstüvwxÿżäbċdëfġhïjklmnöpqrstüvwxÿż0123456789',
    is_enabled: true,
    is_default: true,
    amount: 1,
  },
  {
    id: 'e5bd9f56-11d2-47c0-b2b9-1f2c974b9574',
    text: 'ábćdéfghíjklmńőpqŕśtúvwxýźábćdéfghíjklmńőpqŕśtúvwxýź0123456789',
    is_enabled: true,
    is_default: true,
    amount: 1,
  },
  {
    id: '5dbd2254-6e25-44ea-95ca-8d9cf74bd1da',
    text: 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙzａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ0123456789',
    is_enabled: true,
    is_default: true,
    amount: 1,
  },
  {
    id: '10617302-132d-4e0a-9911-234c2c11dc0f',
    text: 'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ0123456789',
    is_enabled: true,
    is_default: true,
    amount: 1,
  },
  {
    id: '4066917c-d3c9-4f83-ab85-cf56ffcab5db',
    text: 'αв¢∂єƒɢнιנкℓмиσρqяѕтυνωχуzÁßČĎĔŦĞĤĨĴĶĹMŃŐPQŔŚŤÚVŴЖŶŹ0123456789',
    is_enabled: true,
    is_default: true,
    amount: 1,
  },
  {
    id: '4066917c-d3c9-4f83-ab85-cf56ffcab5dl',
    text: 'λB₡ÐE₣GҤłJƙŁM₦ØPQƦ$ŦUV₩X¥ZλB₡ÐE₣GҤłJƙŁM₦ØPQƦ$ŦUV₩X¥Z0123456789',
    is_enabled: true,
    is_default: true,
    amount: 1,
  },
  {
    id: '473e9e99-5927-4061-a676-542748854f67',
    text: '-/:;()₫&@".,?!\'[]{}#%^*+=_\\|~<>$¥€•',
    is_enabled: true,
    is_default: false,
    is_space: true,
    amount: 1,
  },
]

export const createEmptyCharset = (): Charset => ({
  id: uuidv4(),
  text: '',
  is_enabled: true,
  is_default: false,
  amount: 1,
})
