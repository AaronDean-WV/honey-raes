import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

//The React library provides you with a function named useState() to store the state in a component. The function returns an array. The array contains the intial state value at index 0 and a function that modifies the state at index 1. 
export const TicketList = () => {
    const [tickets, setTickets] = useState([]) // naming variables for the tickets
    const [filteredTickets, setFiltered] = useState([]) //naming variables to filter the tickets
    const [emergency, setEmergency] = useState(false)
    const [openOnly, updateOpenOnly] = useState(false)
    const navigate = useNavigate()
    const localHoneyUser = localStorage.getItem("honey_user") //retrieving user from storage
    const honeyUserObject = JSON.parse(localHoneyUser) //naming object that is the pars'd user from local storage

    useEffect(
        () => {
            if (emergency) {
              const emergencyTickets =  tickets.filter(ticket => ticket.emergency === true)
              setFiltered(emergencyTickets)
            }
            else {
                setFiltered(tickets)
            }
        },
        [emergency]
    )

    //useEffect allows you to observe state and then tell it to do something based off of what it observes
    useEffect(
        () => {
            fetch(`http://localhost:8088/serviceTickets`) //fetch from this api
            .then(response => response.json()) //converts the response to json
            .then((ticketArray) => {setTickets(ticketArray)}) //creates ticketArray then uses a function to set the value of it
        },
        [] // When this array is empty, you are observing initial component state
    ) 

    //filters tickets by staff/user
    useEffect(
        () => {
            if (honeyUserObject.staff) {
                setFiltered(tickets)
            } // allows the staff to see all tickets
            else {
                const myTickets = tickets.filter (ticket => ticket.userId === honeyUserObject.id) // creates a var named myTickets and sets it equal to tickets filtered by matching the userId and honeyUserObject ID
                setFiltered(myTickets) //sets the filtered to this value
            }
        },
        [tickets] //observes the current state of tickets 
    
    )


    useEffect(
        () => {
            if (openOnly) {const openTicketArray = tickets.filter(ticket => {
                return ticket.userId === honeyUserObject.id && ticket.dateCompleted === ""
        })
           setFiltered(openTicketArray)}
           
            else {
                const myTickets = tickets.filter (ticket => ticket.userId === honeyUserObject.id) 
                setFiltered(myTickets) 
           }
        },
        [openOnly]
    )
    
    // this sends the information to html 
    return <> 
    {
        honeyUserObject.staff
                ? <>
                <button onClick={ () => { setEmergency(true) } }>Emergency Only</button>
                <button onClick={ () => { setEmergency(false) } }>Show All</button> 
                
                  </>
                :  <>
                <button onClick={ () => navigate("/ticket/create")}>Create Ticket</button> 
                <button onClick={ () => updateOpenOnly(true)}>Open Ticket</button> 
                <button onClick={ () => updateOpenOnly(false)}>All my tickets</button>
                </>
                
    }
    <h2>List of Tickets</h2> 
    <article className="tickets"> 
    { 
    
    //this maps through each filtered ticket then whenever ticket is used it sneds the information in the function to html
    filteredTickets.map(
            (ticket) => {
                return <section className="ticket" key={`ticket--${ticket.id}`}>
                    <header>{ticket.description}</header>
                    <footer>Emergency: {ticket.emergency ? "Yes" : "no"} </footer>
                </section>
            }

        )} 
        </article>
    </>

}
