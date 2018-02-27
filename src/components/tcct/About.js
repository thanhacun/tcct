import React from 'react';
import MarkdownPreview from 'react-markdown';
import ShowJumbotron from './jumbotrons';

const content = `
  ## Kim Bồng Miêu - Theo cánh chim trời ##

  Theo cánh chim trời có thể xem như một nhật ký điền dã. Đó là phần còn lại, phần sâu lắng và
  tinh tế nhất của tác giả sau mỗi chuyến đi, sau mọi công việc. Với người đời, đi là đi, thấy là
  thấy. Với Trương Quang Được một con người gần gủi chân tình lại đượm thêm nét thi sĩ bẩm sinh,
  anh đã biết giữ lại cái đi, cái thấy ấy qua những trắc nghiệm tự thân và qua những chấn
  động tâm hồn. Theo nghĩa ấy, tôi thú vị được dõi theo hành trình tâm trạng của tác giả qua một
  trường hoạt động khá rộng và khá dài, nghĩa là được gặp một Trương Quang Được nữa với
  những tâm tình, những nỗi niềm, những khắc khoải rất đáng trân trọng.

  Tôi yêu cái phần đời, mộc và thật, là phần đậm và nổi nhất của tập thơ. Vẫn là những chất liệu
  sống ấy, người vô tình rất dễ bỏ qua, ở đây nó được dọi sáng bởi tâm hồn tác giả, và được sống
  cuộc sống khác có sức gợi mở của những hình tượng thơ. Trong đời sống thơ ca hiện nay, có
  một số không ít tác giả chú trọng quá mức đến những con chữ, bỏ quên mất phần đời, thì
  trường hợp của Theo cánh chim trời là rất đáng quý. Vì nó đề cao sự sống, đề cao chất bột của
  đời. Không lo cái đế này, cái nền tảng này, thơ dễ đi vào hụt hơi, hư vô chủ nghĩa.

  Thơ có bao nhiêu cách viết thì người làm thơ có ngần ấy lối đi. Có một dạo người ta dè bỉu cái
  loại vải bông tự nhiên, dè bỉu cả tơ tằm để sùng bái các loại vải hóa chất. Bây giờ thì tình thế đã
  thay đổi, người sành điệu lại thích chọn loại vải 100% cotông. Đừng tưởng làm thơ chân mộc dễ.
  Hãy đọc kỹ, bên dưới cái chân mộc ấy là tình điệu của một tâm hồn. Theo cánh chim trời cũng
  theo cách bồi đắp của đời sống. Tìm thơ, hãy theo lối ấy mà đi.

  Xin chức mừng anh Trương Quang Được và xin ngỏ đôi lời cùng bạn đọc.

  Hà Nội, 10/7/2008

  Hữu Thĩnh

  Chủ tịch Hội Nhà văn Việt Nam


`

export default () => {
  return (
    <div className="container">
      <ShowJumbotron />
      <MarkdownPreview source={content} />
    </div>
  )
}
