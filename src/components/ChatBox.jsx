import { format } from "date-fns";

function ChatBox({ id, recipient, setSelected, title, message, unread }) {
    return (
        <div onClick={setSelected(id, recipient)} className="flex w-full box-border text-(--color-text) border-b-1 border-dotted hover:cursor-pointer hover:text-(--color-accent-hover) py-4 border-[gray]">
            <div className="flex basis-1/5 grow-0 justify-center p-2 box-border">
                {
                    recipient ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" className="fill-(--color-text)" viewBox="0 0 640 640"><path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z" /></svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" className="fill-(--color-text)" viewBox="0 0 640 640"><path d="M96 192C96 130.1 146.1 80 208 80C269.9 80 320 130.1 320 192C320 253.9 269.9 304 208 304C146.1 304 96 253.9 96 192zM32 528C32 430.8 110.8 352 208 352C305.2 352 384 430.8 384 528L384 534C384 557.2 365.2 576 342 576L74 576C50.8 576 32 557.2 32 534L32 528zM464 128C517 128 560 171 560 224C560 277 517 320 464 320C411 320 368 277 368 224C368 171 411 128 464 128zM464 368C543.5 368 608 432.5 608 512L608 534.4C608 557.4 589.4 576 566.4 576L421.6 576C428.2 563.5 432 549.2 432 534L432 528C432 476.5 414.6 429.1 385.5 391.3C408.1 376.6 435.1 368 464 368z" /></svg>
                }
            </div>
            <div className="flex grow-0 flex-col box-border px-4 basis-4/5">
                <div className="flex w-full items-center justify-between">
                    <div className="font-semibold text-[18px]">
                        {title}
                    </div>
                    <div className="text-[14px] ">{ message ? format(message.created_at, "eee p") : null }</div>
                </div>
                <div className="flex w-full items-center gap-5">
                    <div className="font-normal grow-1 basis-4/5">
                        {message ?
                            (
                                message.is_media ?
                                "📷 Photo"
                                :
                                message.content.substr(0, 30)
                            )
                                : null
                        }
                        {
                            message ?
                            (
                                message.is_media ?
                                    ""
                                    :
                                    message.content.length > 30 && "...."
                                )
                                : null
                        }
                    </div>
                    {
                        unread > 0 &&
                        <div className="bg-[#1E2933] text-[#A0ADAD] text-[12px] rounded-4xl p-1 px-3">
                            {unread}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ChatBox