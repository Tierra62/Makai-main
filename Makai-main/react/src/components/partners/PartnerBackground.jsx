import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import beach from "../../assets/img/illustrations/beach.jpg";

const PartnerBackground = ({ overlay, position, video, className, style }) => {
    const bgStyle = { backgroundImage: `url(${beach})`, ...style };
    if (typeof position === "string") {
        bgStyle.backgroundPosition = position;
    } else if (typeof position === "object") {
        position.x && (bgStyle.backgroundPositionX = position.x);
        position.y && (bgStyle.backgroundPositionY = position.y);
    }

    return (
        <div
            className={classNames(
                "bg-holder",
                {
                    overlay: overlay,
                    [`overlay-${overlay}`]: typeof overlay === "string",
                },
                className
            )}
            style={bgStyle}
        >
            {video && (
                <video className="bg-video" autoPlay loop muted playsInline>
                    {video.map((src, index) => (
                        <source
                            key={index}
                            src={src}
                            type={`video/${src.split(".").pop()}`}
                        />
                    ))}
                </video>
            )}
        </div>
    );
};

PartnerBackground.propTypes = {
    image: PropTypes.string.isRequired,
    overlay: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    position: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            x: PropTypes.string,
            y: PropTypes.string,
        }),
    ]),
    video: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.string),
};

export default PartnerBackground;
