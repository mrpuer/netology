const pathInfo = require('./path-info');

function showInfo(err, info) {
  if (err) {
    console.log('Возникла ошибка при получении информации');
    return;
  }

  switch (info.type) {
    case 'file':
      console.log(`${info.path} — является файлом, содержимое:`);
      console.log(info.content);
      console.log('-'.repeat(10));
      break;
    case 'directory':
      console.log(`${info.path} — является папкой, список файлов и папок в ней:`);
      info.childs.forEach(name => console.log(`  ${name}`));
      console.log('-'.repeat(10));
      break;
    default:
      console.log('Данный тип узла не поддерживается');
      break;
  }
}

pathInfo('../task2', showInfo);
pathInfo('../task2/logs/999.txt', showInfo);