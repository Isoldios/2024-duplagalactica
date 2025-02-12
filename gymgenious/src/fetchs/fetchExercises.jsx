const correctExercisesData = async (exercisesData) => {
        return exercisesData.map(element => {
            if (!element.owner) {
                return {
                    id: element.id,
                    name: element.name,
                    description: 'Exercise from Train-Mate',
                    owner: 'Train-Mate',
                    image_url: `${process.env.PUBLIC_URL}/logoTrainMate.png`
                };
            }
            return element;
        });
    };  

const fetchExercises = async (setOpenCircularProgress,setWarningConnection,setExercises,setTotalExercises) => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('Token not available in localStorage');
            return;
        }
        const localExercisesRequest = await fetch(`https://two024-duplagalactica.onrender.com/get_excersices`, {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!localExercisesRequest.ok) {
            throw new Error('Error fetching exercises: ' + localExercisesRequest.statusText);
        }
        const localExercises = await localExercisesRequest.json();

        const externalExercisesRequest = await fetch(`https://train-mate-api.onrender.com/api/exercise/get-all-exercises`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const externalExercisesData = await externalExercisesRequest.json();

        const combinedExercises = localExercises.concat(externalExercisesData.exercises);
        const normalizedExercises = await correctExercisesData(combinedExercises);

        setExercises(normalizedExercises);
        setTotalExercises(normalizedExercises);
        setOpenCircularProgress(false);
    } catch (error) {
        console.error("Error fetching users:", error);
        setOpenCircularProgress(false);
        setWarningConnection(true);
        setTimeout(() => {
            setWarningConnection(false);
        }, 3000);
    }
};

export default fetchExercises