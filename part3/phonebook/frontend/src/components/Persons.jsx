const Persons = ({ persons, deleteHandler }) => (
    <div>
        {persons.map((person) => (
            <li key={person.id}> {person.name} {person.number}
            <button onClick={() => deleteHandler(person.id)}>delete</button>
            </li>))}
    </div>
)

export default Persons
