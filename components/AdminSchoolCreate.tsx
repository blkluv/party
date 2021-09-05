import React, { useState } from 'react'
import { db } from "@config/firebase";
import { Input } from './FormComponents';

export default function AdminSchoolCreate() {

    const [schoolName, setSchoolName] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();


        setSchoolName("");
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>School Name</p>
                <Input value={schoolName} onChange={(e: any) => setSchoolName(e.target.value)} />
            </form>
        </div>
    )
}
