import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BudgetGroupingActionModal from 'views/MediaConsole/BudgetGrouping/BudgetGroupingActionModal';
import CustomModal from 'views/UI/CustomModal';
import { useTranslation } from 'react-i18next';
import {
  deleteCampaignGroups,
  toggleBudgetGroupSubscription,
} from '_services/budgetGrouping';

import {
  BG_DETAILS_GROUP,
  EDIT_GROUP_DATA,
  SHOW_NOTIFICATION,
} from 'common/Redux/Constants';
import { getNotificationObject } from 'views/UI/notificationInfo';

const BudgetGroupActionModalContainer = ({
  setIsLoading,
  updateCampaignGroups,
  fromCard,
  fromTable,
  showCustomButton,
}) => {
  const { t } = useTranslation(['common']);
  const { bgDetailsGroup } = useSelector((store) => store.getMediaConsole);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [subscriptionAction, setSubscriptionAction] = useState(undefined);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveClick = () => {
    setIsModalOpen(true);
  };

  const handleRemoveGroup = async () => {
    setIsLoading(true);
    await deleteCampaignGroups([bgDetailsGroup.groupId.toString()])
      .then((resp) => {
        if (resp.statusCode === 200) {
          dispatch({
            type: SHOW_NOTIFICATION,
            payload: getNotificationObject(
              'success',
              `For the Budget Group "${bgDetailsGroup.groupName}"`,
              t('site_titles.delete_group_success')
            ),
          });
        } else {
          dispatch({
            type: SHOW_NOTIFICATION,
            payload: getNotificationObject(
              'error',
              resp.statusDescription + ' Please try deleting again.',
              t('site_titles.delete_group_error')
            ),
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: SHOW_NOTIFICATION,
          payload: getNotificationObject(
            'error',
            err.message + '. Please try deleting again.',
            t('site_titles.delete_group_error')
          ),
        });
      });

    setIsLoading(false);
    updateCampaignGroups();
  };
  const onDeleteClose = () => {
    setIsModalOpen(false);
  };

  const onFollowClose = () => {
    setIsFollowModalOpen(false);
  };

  const handleFollowClick = () => {
    const subscriptionAction = bgDetailsGroup?.isGroupSubscribed
      ? 'unfollow'
      : 'follow';
    setSubscriptionAction(subscriptionAction);
    setIsFollowModalOpen(true);
  };

  const onConfirmRemoveModal = () => {
    handleRemoveGroup();
    onDeleteClose();
    if (location?.pathname.includes('budget-group-details')) {
      setTimeout(() => {
        navigate('/budget-grouping');
      }, 1000); // 1-second delay as get api needs time to update the data
    }
  };

  const onConfirmFollowModal = () => {
    handleGroupSubscription();
    onFollowClose();
  };

  const onEditBudgetGroup = () => {
    dispatch({ type: EDIT_GROUP_DATA, payload: bgDetailsGroup });
    navigate('/new-edit-budget-group');
  };

  const handleGroupSubscription = async () => {
    setIsLoading(true);
    const subscriptionAction = bgDetailsGroup.isGroupSubscribed
      ? 'unfollow'
      : 'follow';
    const requestBody = {
      groupId: bgDetailsGroup.groupId,
      isSubscribed: !bgDetailsGroup.isGroupSubscribed,
    };
    await toggleBudgetGroupSubscription(requestBody)
      .then((resp) => {
        if (resp.statusCode === 200) {
          dispatch({
            type: SHOW_NOTIFICATION,
            payload: getNotificationObject(
              'success',
              t(`site_texts.${subscriptionAction}_group_success`),
              t(`site_titles.${subscriptionAction}_group_success`)
            ),
          });
          dispatch({
            type: BG_DETAILS_GROUP,
            payload: {
              ...bgDetailsGroup,
              isGroupSubscribed: !bgDetailsGroup.isGroupSubscribed,
            },
          });
        } else {
          dispatch({
            type: SHOW_NOTIFICATION,
            payload: getNotificationObject(
              'error',
              resp.statusDescription +
                t(`site_texts.${subscriptionAction}_group_error`),
              t(`site_titles.${subscriptionAction}_group_error`)
            ),
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: SHOW_NOTIFICATION,
          payload: getNotificationObject(
            'error',
            err.message + t(`site_texts.${subscriptionAction}_group_error`),
            t(`site_titles.${subscriptionAction}_group_error`)
          ),
        });
      });

    setIsLoading(false);
    updateCampaignGroups();
  };
  return (
    <>
      <BudgetGroupingActionModal
        handleRemoveClick={handleRemoveClick}
        onEditBudgetGroup={onEditBudgetGroup}
        fromCard={fromCard}
        handleGroupSubscription={handleFollowClick}
        showCustomButton={showCustomButton}
        fromTable={fromTable}
      />
      {isModalOpen && (
        <CustomModal
          open={isModalOpen}
          onClose={() => onDeleteClose()}
          onAccept={() => onConfirmRemoveModal()}
          title={t('site_titles.remove_budget_group')}
          onSaveText={t('button_text.yes_delete')}
          onCloseText={t('button_text.no_cancel')}
          isGroove={true}
          isSmallModal={true}
          actionType='delete'
        >
          <span>{t('site_texts.delete_group')}</span>
        </CustomModal>
      )}

      {isFollowModalOpen && (
        <CustomModal
          open={isFollowModalOpen}
          onClose={() => onFollowClose()}
          onAccept={() => onConfirmFollowModal()}
          title={
            subscriptionAction === 'unfollow'
              ? t('site_titles.unfollow_budget_group')
              : t('site_titles.follow_budget_group')
          }
          onSaveText={
            subscriptionAction === 'unfollow'
              ? t('button_text.yes_unfollow')
              : t('button_text.yes_follow')
          }
          onCloseText={t('button_text.no_cancel')}
          isGroove={true}
          isSmallModal={true}
          actionType='delete'
        >
          <span>
            {subscriptionAction === 'unfollow'
              ? `${t('site_texts.unfollow_budget_group')}`
              : t('site_texts.follow_budget_group')}
          </span>
        </CustomModal>
      )}
    </>
  );
};

export default BudgetGroupActionModalContainer;
