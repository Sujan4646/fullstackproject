export default function Contact() {
    return (
        <div className='container' style={{ padding: '50px 0', textAlign: 'center' }}>
            <h1>Contact Us</h1>
            <p style={{ marginBottom: '30px' }}>Have questions? We'd love to hear from you.</p>

            <form style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
                <div className='form-group'>
                    <label>Name</label>
                    <input type='text' className='form-control' placeholder='Your Name' />
                </div>
                <div className='form-group'>
                    <label>Email</label>
                    <input type='email' className='form-control' placeholder='Your Email' />
                </div>
                <div className='form-group'>
                    <label>Message</label>
                    <textarea className='form-control' placeholder='Your Message' rows='5'></textarea>
                </div>
                <button className='btn btn-block'>Send Message</button>
            </form>
        </div>
    )
}