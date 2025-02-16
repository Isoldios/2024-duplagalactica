const fetchRoutines = async (setOpenCircularProgress, setTotalRoutines, setRoutines, setWarningConnection) => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('Token not available in localStorage');
            setOpenCircularProgress(false);
            return;
        }

        const [routinesData, assignedRoutinesData, exercisesDataLocal, exercisesDataExternal] = await Promise.all([
            fetch('https://two024-duplagalactica.onrender.com/get_routines', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${authToken}` }
            }),
            fetch('https://two024-duplagalactica.onrender.com/get_assigned_routines', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${authToken}` }
            }),
            fetch('https://two024-duplagalactica.onrender.com/get_excersices', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${authToken}` }
            }),
            fetch('https://train-mate-api.onrender.com/api/exercise/get-all-exercises', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${authToken}` }
            })
        ]);

        if (!routinesData.ok || !assignedRoutinesData.ok || !exercisesDataLocal.ok || !exercisesDataExternal.ok) {
            throw new Error('Error fetching data');
        }

        const [routines, assignedRoutines, exercisesList, exercisesFromTrainMate] = await Promise.all([
            routinesData.json(),
            assignedRoutinesData.json(),
            exercisesDataLocal.json(),
            exercisesDataExternal.json()
        ]);

        const routinesWithExercises = routines.map((routine) => {
            const updatedExercises = routine.excercises.map((exercise) => {
                let matchedExercise = exercisesList.find((ex) => ex.id === exercise.id);
                if (!matchedExercise && Array.isArray(exercisesFromTrainMate.exercises)) {
                    matchedExercise = exercisesFromTrainMate.exercises.find((ex) => ex.id === exercise.id);
                }
                return matchedExercise ? { ...exercise, name: matchedExercise.name, description: matchedExercise.description } : exercise;
            });

            return { ...routine, exercises: updatedExercises };
        });

        const routinesWithAssignedCount = routinesWithExercises.map((routine) => {
            const assignedForRoutine = assignedRoutines.filter((assigned) => assigned.id === routine.id);
            const totalAssignedUsers = assignedForRoutine.reduce((acc, assigned) => acc + (assigned.users ? assigned.users.length : 0), 0);

            return { ...routine, cant_asignados: totalAssignedUsers };
        });

        const finalRoutines = routinesWithAssignedCount.map((routine) => ({
            ...routine,
            exercise_length: routine.exercises ? routine.exercises.length : 0,
        }));
        setRoutines(finalRoutines);
        setTotalRoutines(finalRoutines);
        
        setOpenCircularProgress(false);

    } catch (error) {
        console.error("Error fetching routines:", error);
        setWarningConnection(true);
        setTimeout(() => setWarningConnection(false), 3000);
        setOpenCircularProgress(false);
    }
};


export default fetchRoutines;
