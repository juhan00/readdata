import React, {useEffect, useRef, useState} from "react";
import {loadPaymentWidget, ANONYMOUS} from "@tosspayments/payment-widget-sdk";
import {nanoid} from "nanoid";
import className from "classnames/bind";
import styles from "@/src/components/data/leftNavigation/leftNavigation.module.scss";

const cx = className.bind(styles);


const selector = "#payment-widget";

// 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요.
// 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
const widgetClientKey = "test_ck_GePWvyJnrKJqKvpbnw07VgLzN97E";
const customerKey = "SN8QJo_ZSP7nYUdYPuRPn";

export function TossPay() {
    const [paymentWidget, setPaymentWidget] = useState(null);
    const paymentMethodsWidgetRef = useRef(null);
    const [price, setPrice] = useState(50_000);

    useEffect(() => {
        const fetchPaymentWidget = async () => {
            try {
                const loadedWidget = await loadPaymentWidget(
                    widgetClientKey,
                    customerKey
                );
                setPaymentWidget(loadedWidget);
            } catch (error) {
                console.error("Error fetching payment widget:", error);
            }
        };

        fetchPaymentWidget();
    }, []);

    useEffect(() => {
        if (paymentWidget == null) {
            return;
        }

        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
            selector,
            {value: price},
            {variantKey: "DEFAULT"}
        );

        paymentWidget.renderAgreement("#agreement", {variantKey: "AGREEMENT"});

        paymentMethodsWidgetRef.current = paymentMethodsWidget;
    }, [paymentWidget, price]);

    useEffect(() => {
        const paymentMethodsWidget = paymentMethodsWidgetRef.current;

        if (paymentMethodsWidget == null) {
            return;
        }

        paymentMethodsWidget.updateAmount(price);
    }, [price]);

    const handlePaymentRequest = async () => {
        // TODO: 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
        // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
        try {
            await paymentWidget?.requestPayment({
                orderId: nanoid(),
                orderName: "토스 티셔츠 외 2건",
                customerName: "김토스",
                customerEmail: "customer123@gmail.com",
                customerMobilePhone: "01012341234",
                successUrl: `${window.location.origin}/success`,
                failUrl: `${window.location.origin}/fail`,
            });
        } catch (error) {
            console.error("Error requesting payment:", error);
        }
    };

    return (
        <div className="wrapper">
            <div className="box_section">
                {/* 결제 UI, 이용약관 UI 영역 */}
                <div id="payment-widget"/>
                <div id="agreement"/>
                <div id="coupon" style={{paddingLeft: "24px"}}>
                    {/* 할인 쿠폰 */}
                    <div className="checkable typography--p">
                        <label
                            htmlFor="coupon-box"
                            className="checkable__label typography--regular"
                        >
                            <input
                                id="coupon-box"
                                className="checkable__input"
                                type="checkbox"
                                aria-checked="true"
                                onChange={(event) => {
                                    setPrice(
                                        event.target.checked ? price - 6_000 : price + 6_000
                                    );
                                }}
                            />
                            <span id="discountSpan" style={{color: "#4e5968", fontSize: "16px", fontWeight: "500"}}
                                  className="checkable__label-text">6,000원 쿠폰 적용</span>
                        </label>
                    </div>
                </div>
                <div className="result wrapper">
                    {/* 결제하기 버튼 */}
                    <button
                        className="button"
                        style={{marginTop: "30px"}}
                        onClick={handlePaymentRequest}
                    >
                        결제하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TossPay;