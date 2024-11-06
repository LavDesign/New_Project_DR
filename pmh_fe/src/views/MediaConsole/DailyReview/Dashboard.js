import styles from "_theme/modules/dailyReview/dailyReview.module.css";
import { useSelector } from "react-redux";
import ReportContainer from "views/Reports/reportContainer";

const Dashboard = () => {
    const { selectedDailyReviewMenu } = useSelector(
        (store) => store.getMediaConsole
    );

    console.log("View Selected Group", selectedDailyReviewMenu?.groupList);
    let uniqueGroupNames = null;
    if (selectedDailyReviewMenu && selectedDailyReviewMenu.groupList && selectedDailyReviewMenu.groupList.campaigns) {
        const groupNames = selectedDailyReviewMenu.groupList.campaigns.map(
            (campaign) => campaign.groupName
        );
        uniqueGroupNames = [...new Set(groupNames)];
    } else {
        uniqueGroupNames = "";
    }

    console.log("View Selected UniqueGroupNames", uniqueGroupNames);

    return (
        <div
            className={`${styles["daily-review-container-section"]} ${styles["daily-review-container-section-width"]}`}
        >
            <div className={styles["daily-review-container-section-title"]}>
                Dashboard
            </div>
            <div id="sisenseApp">
                <ReportContainer
                    filtergroupscustom={uniqueGroupNames}
                />
            </div>
        </div>
    );
};

export default Dashboard;
