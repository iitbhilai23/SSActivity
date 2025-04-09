import React from "react";
import "../styles/DashboardHome.css";

function DashboardHome() {
    return (
        <div className="dashboard-home">
            <h2> Samagra Shiksha Item Distribute System</h2>
            <p >Manage School Library Books and Sports, FLN Books</p>

            {/*  Dashboard Stats Cards */}
            <div className="dashboard-cards">
                <div className="card"> Total Books<br/> 45473</div>
                <div className="card"> Total CIIL Books <br/>30477</div>
                <div className="card"> Total NBI Books <br/>13093</div>
          
                <div className="card"> Total EOI Books<br/> 1903</div>
                <div className="card"> Total Verify Books <br/>10141</div>
                <div className="card"> Total Unverify Books <br/>30071</div>
                <div className="card"> Total Damaged Books <br/>531</div>
               
            </div>
        </div>
    );
}

export default DashboardHome;
