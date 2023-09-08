import React from "react";
import { Card, Image } from "react-bootstrap";
import Makai from "../../assets/img/logos/Makai.png";

const PageHeader = () => {
    return (
        <Card className="mb-3">
            <Card.Body className="d-flex gap-2 flex-wrap flex-between-center">
                <div>
                    <h1 className="text-primary">Welcome to Makai!</h1>
                </div>
                <div>
                    <Image src={Makai} alt="Makai Logo" width={125} height={125} />
                </div>
            </Card.Body>
        </Card>
    );
};

export default PageHeader;
