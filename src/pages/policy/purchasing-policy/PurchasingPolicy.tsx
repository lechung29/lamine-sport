/** @format */

import { Box, Breadcrumbs, Container, Text } from "@/components";
import React from "react";

const PurchasingPolicy: React.FunctionComponent = () => {
    return (
        <Container className="w-full min-h-screen">
            <Breadcrumbs />

            <Container className="!px-8 lg:!px-[45px] !py-6">
                <Text margin={[0, 0, 15, 0]} size="lg" fontWeight="bold" textTransform="uppercase" className="text-gray-900" titleText="Chính sách mua hàng" />
                <Text margin={[0, 0, 15, 0]} size="base" fontWeight="semibold" className="text-gray-900" titleText="Chính sách thanh toán:" />
                <Box margin={[0, 0, 16, 0]}>
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Có 3 hình thức thanh toán, khách hàng có thể lựa chọn hình thức thuận tiện và phù hợp với mình nhất:"
                    />
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="Cách 1: Thanh toán tiền mặt trực tiếp địa chỉ của chúng tôi" />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Cách 2: Thanh toán khi nhận hàng (COD), khách hàng xem hàng tại nhà, thanh toán tiền mặt cho nhân viên giao nhận hàng."
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Cách 3: Chuyển khoản trước. Quý khách chuyển khoản trước, sau đó chúng tôi tiến hành giao hàng theo thỏa thuận hoặc hợp đồng với Quý khách."
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5 italic"
                        titleText="• Lưu ý: Nội dung chuyển khoản ghi rõ họ tên và chuyển cho món hàng nào. Sau khi chuyển khoản, chúng tôi sẽ liên hệ xác nhận và tiến hành giao hàng. Nếu sau thời gian thỏa thuận mà chúng tôi không giao hàng hoặc không phản hồi lại, quý khách có thể gửi khiếu nại trực tiếp về địa chỉ trụ sở và yêu cầu bồi thường nếu chứng minh được sự chậm trễ làm ảnh hưởng đến kinh doanh của quý khách."
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Đối với khách hàng có nhu cầu mua số lượng lớn để kinh doanh hoặc buôn sỉ vui lòng liên hệ trực tiếp với chúng tôi để có chính sách giá cả hợp lý. Và việc thanh toán sẽ được thực hiện theo hợp đồng. Chúng tôi cam kết kinh doanh minh bạch, hợp pháp, bán hàng chất lượng, có nguồn gốc."
                    />
                </Box>
                <Text margin={[0, 0, 15, 0]} size="base" fontWeight="semibold" className="text-gray-900" titleText="Chính sách xử lý khiếu nại:" />
                <Box margin={[0, 0, 16, 0]}>
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="- Tiếp nhận mọi khiếu nại của khách hàng liên quan đến việc sử dụng dịch vụ của công ty." />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="- Tất cả mọi trường hơp bảo hành, quý khách có thể liên hệ với chúng tôi để làm thủ tục bảo hành."
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="- Thời gian giải quyết khiếu nại trong thời hạn tối đa là 03 (ba) ngày làm việc kể từ khi nhận được khiếu nại của của khách hàng. Trong trường hợp bất khả kháng 2 bên sẽ tự thương lượng."
                    />
                </Box>
                <Text margin={[0, 0, 15, 0]} size="base" fontWeight="semibold" className="text-gray-900" titleText="Chính sách vận chuyển và giao nhận:" />
                <Box margin={[0, 0, 16, 0]}>
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Thông thường sau khi nhận được thông tin đặt hàng chúng tôi sẽ xử lý đơn hàng trong vòng 24h và phản hồi lại thông tin cho khách hàng về việc thanh toán và giao nhận. Thời gian giao hàng thường trong khoảng từ 3-5 ngày kể từ ngày chốt đơn hàng hoặc theo thỏa thuận với khách khi đặt hàng. Tuy nhiên, cũng có trường hợp việc giao hàng kéo dài hơn nhưng chỉ xảy ra trong những tình huống bất khả kháng như sau:"
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="- Nhân viên chúng tôi liên lạc với khách hàng qua điện thoại không được nên không thể giao hàng."
                    />
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="- Địa chỉ giao hàng bạn cung cấp không chính xác hoặc khó tìm." />
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="- Số lượng đơn hàng tăng đột biến khiến việc xử lý đơn hàng bị chậm." />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="- Đối tác cung cấp hàng chậm hơn dự kiến khiến việc giao hàng bị chậm lại hoặc đối tác vận chuyển giao hàng bị chậm."
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Về phí vận chuyển, chúng tôi sử dụng dịch vụ vận chuyển ngoài nên cước phí vận chuyển sẽ được tính theo phí của các đơn vị vận chuyển tùy vào vị trí và khối lượng của đơn hàng, khi liên hệ lại xác nhận đơn hàng với khách sẽ báo mức phí cụ thể cho khách hàng."
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Riêng khách tỉnh có nhu cầu mua số lượng lớn hoặc khách buôn sỉ nếu có nhu cầu mua sản phẩm , chúng tôi sẽ nhờ dịch vụ giao nhận của các công ty vận chuyển và phí sẽ được tính theo phí của các đơn vị cung cấp dịch vụ vận chuyển hoặc theo thoản thuận hợp đồng giữa 2 bên."
                    />
                </Box>
            </Container>
        </Container>
    );
};

export { PurchasingPolicy };
