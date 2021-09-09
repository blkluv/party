import React from "react";
import Header from "@components/Header";

const errors = {
    404: {
        title: "Resource not found"
    },
    403: {
        title: "Unauthorized access",
        description: "You do not have permission to view this page"
    },
    "": {
        title: "",
        description: ""
    }
}

export default function Error({ id = "" }) {
    return (
        <div className="flex-1 flex justify-center items-center">
            <Header title="Error" />
            <div className="w-full max-w-sm mx-2 sm:px-12 py-12 px-6  rounded-md bg-white border border-gray-300">
                <h2>{`Error (${id})`}</h2>
                <h3>{`${errors[id].title}`}</h3>
                <p>{errors[id].description}</p>
            </div>
        </div>
    );
}

export const getServerSideProps = async (req, res) => {
    const { id, } = req.query;

    return { props: { id } };
};

