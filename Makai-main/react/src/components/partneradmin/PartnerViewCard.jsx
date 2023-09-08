import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Col, Container, Row, Button } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import Flex from "components/common/Flex";
import Avatar, { AvatarGroup } from "components/common/Avatar";
import SoftBadge from "components/common/SoftBadge";
import debug from "sabio-debug";
import "./Partners.css";

const _logger = debug.extend("partners");

const PartnerViewCard = () => {
    const { state } = useLocation();
    const [partner, setPartnerData] = useState({});

    useEffect(() => {
        if (state && state.type === "PARTNER_VIEW" && state.payload) {
            _logger("Payload change", state.payload);
            setPartnerData((prevState) => {
                let stateOfPartners = { ...prevState, ...state.payload };
                return stateOfPartners;
            });
        }
    }, []);

    _logger("PartnerInfo location:", location);

    const badgeStatus = (standStatusId) => {
        if (standStatusId === 1) {
            return "success";
        } else {
            return "warning";
        }
    };

    return (
        <React.Fragment>
            <Container className="p-4 m-3">
                <Row>
                    <Col>
                        <Link to="/dashboard/admin">
                            <Button>Back</Button>
                        </Link>
                        <Card className="p-1 m-2 view-card" style={{ maxWidth: "60rem" }}>
                            <h1 className="text-primary p-1 m-2 display-4">
                                {partner?.name}
                            </h1>
                            <Card.Img
                                variant="top"
                                src={partner?.logo}
                                className="partner-logo-image p-1 m-2"
                            />
                            <Flex alignItems="center" className="position-relative">
                                <div className="flex-1 display-6">
                                    <strong> Tel: {partner?.businessPhone}</strong>
                                    <p>
                                        <Link to={`${partner?.siteUrl}`}>{partner?.siteUrl}</Link>
                                    </p>
                                </div>
                            </Flex>
                            <Container className="text-center">
                                <Flex className="p-2">
                                    <Col>
                                        <h4 className="fw-semi-bold text-info">Stand owner: </h4>
                                        <Avatar
                                            src={partner?.user?.avatarUrl}
                                            width="80"
                                            alt="logo"
                                            className="border border-2 rounded-circle border-info justify-content-center"
                                        />
                                        <p>
                                            Name: {partner?.user?.firstName} {partner?.user?.lastName}
                                        </p>
                                    </Col>
                                    <Col>
                                        <h4 className="fw-semi-bold text-info">Members:</h4>
                                        {partner?.members && (
                                            <AvatarGroup dense className="avatar-group-container">
                                                {partner?.members?.map(
                                                    ({ user: { avatarUrl, id, name } }) => (
                                                        <Avatar
                                                            src={avatarUrl && avatarUrl}
                                                            key={id}
                                                            name={name && name}
                                                            isExact
                                                            className="border border-2 rounded-circle border-info"
                                                        />
                                                    )
                                                )}
                                            </AvatarGroup>
                                        )}
                                    </Col>
                                </Flex>
                            </Container>
                            <Card.Footer>
                                <Col className="text-muted align-items-center">
                                    <strong>
                                        Member Since:{" "}
                                        {new Date(
                                            partner?.stands?.[0]?.dateOpened
                                        ).toLocaleDateString()}
                                    </strong>
                                </Col>
                                <Col>
                                    <SoftBadge
                                        pill
                                        bg={badgeStatus(partner?.stands?.[0].standStatusId)}
                                    >
                                        {partner?.stands?.[0].standStatusId === 1
                                            ? "Active"
                                            : "Inactive"}
                                    </SoftBadge>
                                </Col>
                            </Card.Footer>
                            <Col></Col>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default PartnerViewCard;

PartnerViewCard.propTypes = {
    partner: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        logo: PropTypes.string,
        businessPhone: PropTypes.string,
        siteUrl: PropTypes.string,
        user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            mi: PropTypes.string,
            avatarUrl: PropTypes.string,
        }),
        stands: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                standStatusId: PropTypes.number,
                partnerId: PropTypes.number,
                isPrivate: PropTypes.bool,
                isReservable: PropTypes.bool,
                locationId: PropTypes.number,
                dateOpened: PropTypes.string,
                dateCreated: PropTypes.string,
                dateModified: PropTypes.string,
            })
        ),
        members: PropTypes.arrayOf(
            PropTypes.shape({
                user: PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    firstName: PropTypes.string.isRequired,
                    lastName: PropTypes.string.isRequired,
                    mi: PropTypes.string,
                    avatarUrl: PropTypes.string,
                }),
                partnerType: PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    name: PropTypes.string.isRequired,
                }),
            })
        ),
        dateCreated: PropTypes.string,
        dateModified: PropTypes.string,
        isActive: PropTypes.bool,
    }),
};
