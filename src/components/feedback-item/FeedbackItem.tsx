/** @format */

import { DEFAULT_AVATAR, FEEDBACK_ITEM_BG } from "@/constants";
import { IReview } from "@/types";
import { Avatar, Flex, Rate, Tooltip } from "antd";
import React from "react";
import { Box, Text } from "../elements";

interface IFeedbackItemProps {
    feedbackItem: IReview;
}

const FeedbackItem: React.FunctionComponent<IFeedbackItemProps> = (props) => {
    const { feedbackItem } = props;
    return (
        <Box
            className="relative !px-4 !py-5 bg-white overflow-hidden"
            style={{
                height: "200px",
                backgroundPosition: "calc(100% - 15px) 15px",
                backgroundImage: `url(${FEEDBACK_ITEM_BG})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "60px",
            }}
        >
            <Box
                className="relative before:!content-[''] before:!absolute before:!top-full before:!left-10
                before:!border-t-[15px] before:!border-l-[15px] before:!border-b-0 before:!border-r-0
                before:!border-t-white before:!border-l-transparent before:!border-solid"
            />
            <Flex gap={16} style={{ height: "100%" }}>
                <Avatar size={{ xs: 64, sm: 64, md: 64, lg: 86, xl: 110, xxl: 130 }} src={feedbackItem.userId ? feedbackItem.userInfo?.avatar : DEFAULT_AVATAR} />
                <Flex vertical className="flex-1 !pl-5" style={{ overflow: "hidden" }}>
                    <Text
                        margin={[0, 0, 8, 0]}
                        color="#333"
                        size="lg"
                        fontWeight="bold"
                        titleText={`Khách hàng. ${feedbackItem.userId ? feedbackItem.userInfo?.displayName : feedbackItem.guestInfo?.displayName}`}
                    />
                    <Rate disabled value={feedbackItem.rating} className="text-yellow-400" />
                    <Tooltip title={feedbackItem.comment} color="#01112f">
                        <Box
                            style={{
                                marginTop: "8px",
                                color: "#333",
                                display: "-webkit-box",
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                lineHeight: "1.5",
                                maxHeight: "6em",
                            }}
                        >
                            "{feedbackItem.comment}."
                        </Box>
                    </Tooltip>
                </Flex>
            </Flex>
        </Box>
    );
};

export { FeedbackItem };
