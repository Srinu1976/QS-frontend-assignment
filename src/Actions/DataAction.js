import axios from 'axios';

// Action to fetch all data
export const fetchAllData = () => async (dispatch) => {
    try {
        dispatch({ type: 'DATA_REQUEST' });
        
        const { data } = await axios.get("https://api.quicksell.co/v1/internal/frontend-assignment/");
        
        dispatch({ type: 'DATA_SUCCESS', payload: data });
    } catch (error) {
        dispatch({ type: 'DATA_FAILURE', payload: error.message });
    }
};

// Action to select and sort data based on group and orderValue
export const selectData = (group, allTickets, orderValue) => async (dispatch) => {
    try {
        dispatch({ type: 'SELECT_DATA_REQUEST' });

        let selectedData = [];
        const priorities = ["No priority", "Low", "Medium", "High", "Urgent"];

        if (group === 'status') {
            const uniqueStatuses = [...new Set(allTickets.map(ticket => ticket.status))];
            
            selectedData = uniqueStatuses.map((status, index) => ({
                [index]: {
                    title: status,
                    value: allTickets.filter(ticket => ticket.status === status),
                }
            }));
        } else if (group === 'user') {
            selectedData = allTickets.allUser.map((user, index) => ({
                [index]: {
                    title: user.name,
                    value: allTickets.allTickets.filter(ticket => ticket.userId === user.id),
                }
            }));
        } else {
            selectedData = priorities.map((priority, index) => ({
                [index]: {
                    title: priority,
                    value: allTickets.filter(ticket => ticket.priority === index),
                }
            }));
        }

        // Sorting by title or priority
        if (orderValue === 'title') {
            selectedData.forEach(item => {
                Object.values(item)[0].value.sort((a, b) => a.title.localeCompare(b.title));
            });
        } else if (orderValue === 'priority') {
            selectedData.forEach(item => {
                Object.values(item)[0].value.sort((a, b) => b.priority - a.priority);
            });
        }

        dispatch({ type: 'SELECT_DATA_SUCCESS', payload: { selectedData, user: group === 'user' } });

    } catch (error) {
        dispatch({ type: 'SELECT_DATA_FAILURE', payload: error.message });
    }
};