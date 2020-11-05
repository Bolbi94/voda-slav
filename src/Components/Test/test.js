var s = `<dl><dt style="background-color: #eeeeee; padding: 4px; font-weight: bold;">Особовий рахунок</dt><dd style="margin: 4px 4px 16px 4px;">2340110620</dd><dt style="background-color: #eeeeee; padding: 4px; font-weight: bold;">Прізвище та ім'я</dt><dd style="margin: 4px 4px 16px 4px;">Зеневич Ірина</dd><dt style="background-color: #eeeeee; padding: 4px; font-weight: bold;">Адреса</dt><dd style="margin: 4px 4px 16px 4px;">Славутич Добринінський д.11 кв.62</dd><dt style="background-color: #eeeeee; padding: 4px; font-weight: bold;">Номер телефону</dt><dd style="margin: 4px 4px 16px 4px;">0973272338</dd><dt style="background-color: #eeeeee; padding: 4px; font-weight: bold;">Туалет (холодна)</dt><dd style="margin: 4px 4px 16px 4px;">573</dd><dt style="background-color: #eeeeee; padding: 4px; font-weight: bold;">Туалет (гаряча)</dt><dd style="margin: 4px 4px 16px 4px;">191</dd><dt style="background-color: #eeeeee; padding: 4px; font-weight: bold;">За який місяць</dt><dd style="margin: 4px 4px 16px 4px;"> Жовтень</dd><dt style="background-color: #eeeeee; padding: 4px; font-weight: bold;">Дата заповнення форми</dt><dd style="margin: 4px 4px 16px 4px;">Середа, 28 жовтня 2020</dd><dt style="background-color: #eeeeee; padding: 4px; font-weight: bold;">Site Name</dt><dd style="margin: 4px 4px 16px 4px;">КП «Славутич-водоканал»</dd><dt style="background-color: #eeeeee; padding: 4px; font-weight: bold;">Contact Page URL</dt><dd style="margin: 4px 4px 16px 4px;"><a href='https://vodaslav.com.ua/lichylnyky/nadannya-pokaznykiv'>Надати показники</a></dd><dt style="background-color: #eeeeee; padding: 4px; font-weight: bold;">Client IP address</dt><dd style="margin: 4px 4px 16px 4px;">94.178.69.134</dd>`;
var i = 0, j = 0;
var headerArr = [], valueArr = [];
// const HeaderTagOpen = `<dt style="background-color: #eeeeee; padding: 4px; font-weight: bold;">`, HeaderTagClose = `</dt>`;
// const ValueTagOpen = `<dd style="margin: 4px 4px 16px 4px;">`, ValueTagClose = `</dd>`;
var iteration = 0;
while(s.indexOf(HeaderTagOpen, i) > -1) {
  i = s.indexOf(HeaderTagOpen, i) + HeaderTagOpen.length;
  j = s.indexOf(HeaderTagClose, i);
  headerArr.push(s.slice(i, j));
  console.log(i, j, headerArr);
  if(++iteration > 20) {
    iteration = 0, i = 0, j = 0;
    break;
  }
}
i = 0, j = 0;
while(s.indexOf(ValueTagOpen, i) > -1) {
  i = s.indexOf(ValueTagOpen, i) + ValueTagOpen.length;
  j = s.indexOf(ValueTagClose, i);
  valueArr.push(s.slice(i, j));
  console.log(i + ValueTagOpen.length, j, valueArr);
  if(++iteration > 20) {
    iteration = 0, i = 0, j = 0;
    break;
  }
}

//var t = temp2.substring(temp2.indexOf("<dl>"), temp2.indexOf("</dl>"));