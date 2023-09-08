import React, { useEffect, useState } from "react";
import * as partnerService from "../../services/partnerService";
import debug from "sabio-debug";
import PartnerViewCard from "./PartnerViewCard";
import { Col, Container, Row } from "react-bootstrap";

const _logger = debug.extend("partners");

const PartnerView = () => {
    const [pageData, setPageData] = useState({
        partnerArr: [],
        partnerComponents: [],
        pageIndex: 1,
        pageSize: 8,
        totalCount: 0,
    })

    useEffect(() => {
        partnerService
            .getAllPartners(pageData.pageIndex - 1, pageData.pageSize)
            .then(onGetSuccess)
            .catch(onGetError);
    }, [pageData.pageIndex, pageData.pageSize])

    const onGetSuccess = data => {
        _logger(data);
        let newArr = data.item.pagedItems;
        setPageData((prevState) => {
            const pageData = { ...prevState }
            pageData.partnerArr = newArr.map(mapView);
            return pageData;
        });
    };

    const onGetError = (error) => {
        _logger(error, "data error");
    };

    const mapView = (partner) => {
        return <PartnerViewCard
            key={partner.id}
            partner={partner}
        />
    }

    return (
        <React.Fragment>
            <Container>
                <Row>
                    <Col>
                        <h1>{pageData.name}</h1>
                    </Col>
                    <Col>{pageData.partnerArr}</Col>
                </Row>
            </Container>
        </React.Fragment>
    )
};

export default PartnerView