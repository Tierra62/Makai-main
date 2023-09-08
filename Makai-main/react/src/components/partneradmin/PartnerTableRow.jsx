import React from "react";
import PropTypes from "prop-types";
import Avatar, { AvatarGroup } from "components/common/Avatar";
import Flex from "components/common/Flex";
import { Link, useNavigate } from "react-router-dom";
import SoftBadge from "components/common/SoftBadge";
import debug from "sabio-debug";

const _logger = debug.extend("partners");
const PartnerTableRow = (props) => {
    const navigate = useNavigate();
    const partner = props.partner;

    const onPartnerClicked = (e) => {
        e.preventDefault();
        _logger("Redirecting to : /", partner.id);

        const information = { type: "PARTNER_VIEW", payload: partner };
        navigate(`/dashboard/partner/${partner.id}`, { state: information });
    };

    const badgeStatus = (standStatusId) => {
        if (standStatusId === 1) {
            return "success";
        } else {
            return "warning";
        }
    };

    return (
        <React.Fragment>
            <tr onClick={onPartnerClicked}>
                <td>
                    <Avatar size="2xl" src={partner?.logo} width="60" alt="logo" />
                </td>
                <td>
                    <Flex alignItems="center" className="position-relative">
                        <div className="flex-1 ms-3">
                            <h6 className="mb-0 fw-semi-bold">{partner?.name}</h6>
                            <p className="fs--2 mb-0 text-500">
                                <Link className="text-dark stretched-link" to="#!">
                                    {partner?.siteUrl}
                                </Link>
                            </p>
                        </div>
                    </Flex>
                </td>
                <td>
                    <span>{partner?.businessPhone}</span>
                </td>
                <td>
                    <span>{partner?.stands?.[0]?.id}</span>
                </td>
                <td>
                    {partner?.members && (
                        <AvatarGroup dense>
                            {partner?.members?.map(({ user: { avatarUrl, id } }) => (
                                <Avatar
                                    src={avatarUrl && avatarUrl}
                                    key={id}
                                    isExact
                                    size="2xl"
                                    className="border border-3 rounded-circle border-light"
                                />
                            ))}
                        </AvatarGroup>
                    )}
                </td>
                <td>
                    <SoftBadge pill bg={badgeStatus(partner?.stands?.[0].standStatusId)}>
                        {partner?.stands?.[0].standStatusId === 1
                            ? "Available"
                            : "Unavailable"}
                    </SoftBadge>
                </td>
            </tr>
        </React.Fragment>
    );
};

export default PartnerTableRow;
PartnerTableRow.propTypes = {
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
