import {useUser} from '@clerk/clerk-react'
import { FinancialRecordForm } from './fin-record-form';
import { FinancialRecordList } from './fin-record-list';

export const Dashboard = () => {

    const {user} = useUser();

    return (
        <div className="dashboard-container">
            <h1>Welcome {user?.firstName}!</h1>
            <FinancialRecordForm />
            <FinancialRecordList />
        </div>
    );
}