import axiosInstance from './axiosAPI';

export async function getUsers(setUser){
    return axiosInstance.get('/api/v1/user/')
    .then(res=>{
        setUser(res.data);
    })
    .catch(err=>{
        console.log(err)
    })
}

export async function getTasks(setTasks){
    return axiosInstance.get('/api/v1/task/')
    .then(res=>{
        setTasks(res.data);
    })
    .catch(err=>{
        console.log(err)
    })
}

export async function getGoals(setGoals){
    return axiosInstance.get('/api/v1/goal/')
    .then(res=>{
        setGoals(res.data);
    })
    .catch(err=>{
        console.log(err)
        return axiosInstance.post('/api/v1/goal/', {})
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
    })
}

export async function getReviewSessions(setReviewSessions){
    return axiosInstance.get('/api/v1/review-session/')
    .then(res=>{
        if (res.data.message){
            setReviewSessions([]);
            return;
        }
        setReviewSessions(res.data);
    })
    .catch(err=>{
        console.log(err)
    })
}

export async function getReviewSessionsByTask(taskId){
    return axiosInstance.get('/api/v1/review-session/'+taskId+'/')
    .then(res=>{
        return res.data
    })
    .catch(err=>{
        console.log(err)
    })
}

export async function getReviewSession(taskId, reviewSessionId){
    return axiosInstance.get('/api/v1/review-session/'+taskId+'/'+reviewSessionId+'/')
    .then(res=>{
        return res.data
    })
    .catch(err=>{
        console.log(err)
    })
}

export async function getFriendRequests(setFriendRequests){
    return axiosInstance.get('/api/v1/friend/request/')
    .then(res=>{
        setFriendRequests(res.data);
    })
    .catch(err=>{
        console.log(err)
    })
}

export async function getTaskTypes(setTaskTypes){
    return axiosInstance.get('/api/v1/task-types/')
    .then(res=>{
        setTaskTypes(res.data);
    })
    .catch(err=>{
        console.log(err);
    })
}

export async function getTaskStats(setTaskStats){
    return axiosInstance.get('/api/v1/task-stats/')
    .then(res=>{
        setTaskStats(res.data);
    })
    .catch(err=>{
        console.log(err);
    })
}

export async function getPersonalInfo(setPersonalInfo){
    return axiosInstance.get('/api/v1/user/me')
    .then(res=>{
        setPersonalInfo(res.data);
    })
    .catch(err=>{
        console.log(err);
    })
}